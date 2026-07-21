const MAX_FILE_BYTES = 12 * 1024 * 1024;
const COMPANY_DOMAIN = (process.env.COMPANY_DOMAIN || "pezonproperties.com").toLowerCase();

const drawExtractionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "documentType",
    "projectName",
    "contractor",
    "drawNumber",
    "submittedConstructionBudget",
    "approvedAmount",
    "approvedDate",
    "remainingBudget",
    "requestedAmount",
    "budgetLineTotal",
    "completionPercent",
    "inspectionStatus",
    "expectedNextDrawDate",
    "holdbackTotal",
    "holdbackEligible",
    "summary",
    "requirements",
    "budgetLines",
    "photos",
    "followUps",
    "confidence",
    "notes"
  ],
  properties: {
    documentType: { type: "string" },
    projectName: { type: "string" },
    contractor: { type: "string" },
    drawNumber: { type: "string" },
    submittedConstructionBudget: { type: "number" },
    approvedAmount: { type: "number" },
    approvedDate: { type: "string" },
    remainingBudget: { type: "number" },
    requestedAmount: { type: "number" },
    budgetLineTotal: { type: "number" },
    completionPercent: { type: "number" },
    inspectionStatus: { type: "string" },
    expectedNextDrawDate: { type: "string" },
    holdbackTotal: { type: "number" },
    holdbackEligible: { type: "number" },
    summary: { type: "string" },
    requirements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "complete", "note"],
        properties: {
          label: { type: "string" },
          complete: { type: "boolean" },
          note: { type: "string" }
        }
      }
    },
    budgetLines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "budget", "requested"],
        properties: {
          label: { type: "string" },
          budget: { type: "number" },
          requested: { type: "number" }
        }
      }
    },
    photos: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "note"],
        properties: {
          title: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    followUps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "note"],
        properties: {
          title: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    confidence: { type: "number" },
    notes: { type: "array", items: { type: "string" } }
  }
};

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readRequestBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_FILE_BYTES + 1024 * 1024) {
      throw new Error("File is too large. Please upload a document or image under 12 MB.");
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function parseMultipart(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!boundaryMatch) throw new Error("Missing upload boundary.");
  const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`;
  const parts = buffer.toString("binary").split(boundary).slice(1, -1);

  for (const part of parts) {
    const trimmed = part.replace(/^\r\n/, "").replace(/\r\n$/, "");
    const splitIndex = trimmed.indexOf("\r\n\r\n");
    if (splitIndex === -1) continue;
    const rawHeaders = trimmed.slice(0, splitIndex);
    const body = trimmed.slice(splitIndex + 4);
    const disposition = rawHeaders.match(/content-disposition:[^\n]*name="file"[^\n]*filename="([^"]+)"/i);
    if (!disposition) continue;
    const typeMatch = rawHeaders.match(/content-type:\s*([^\r\n]+)/i);
    return {
      filename: disposition[1],
      type: typeMatch?.[1]?.trim() || "application/octet-stream",
      data: Buffer.from(body, "binary")
    };
  }
  throw new Error("No file was uploaded.");
}

function isSupportedFile(file) {
  return (
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type.startsWith("image/") ||
    /\.(pdf|doc|docx|jpe?g|png|webp|heic|heif)$/i.test(file.filename)
  );
}

function isImage(file) {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.filename);
}

function normalizeMimeType(file) {
  const name = file.filename.toLowerCase();
  if (file.type && file.type !== "application/octet-stream") return file.type;
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".doc")) return "application/msword";
  if (name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".heic")) return "image/heic";
  if (name.endsWith(".heif")) return "image/heif";
  return file.type || "application/octet-stream";
}

async function verifyUser(req) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return;

  const authorization = req.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    throw new Error("Please sign in before using AI document extraction.");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      authorization
    }
  });
  if (!response.ok) throw new Error("Your sign-in session could not be verified.");
  const user = await response.json();
  if (!String(user.email || "").toLowerCase().endsWith(`@${COMPANY_DOMAIN}`)) {
    throw new Error(`Use an @${COMPANY_DOMAIN} email address.`);
  }
}

function outputText(response) {
  if (response.output_text) return response.output_text;
  return (response.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .join("");
}

async function extractWithOpenAI(file) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured in Vercel.");
  }

  file.type = normalizeMimeType(file);
  const dataUrl = `data:${file.type};base64,${file.data.toString("base64")}`;
  const uploadedContent = isImage(file)
    ? {
        type: "input_image",
        image_url: dataUrl,
        detail: "high"
      }
    : {
        type: "input_file",
        filename: file.filename,
        file_data: dataUrl,
        detail: file.type === "application/pdf" ? "high" : undefined
      };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      input: [
        {
          role: "user",
          content: [
            uploadedContent,
            {
              type: "input_text",
              text:
                "You are reading a construction draw tracker source file for Pezon Properties. It may be a PDF, Word document, scanned invoice, SOW, draw approval, inspection report, lender package, or progress photo. " +
                "Extract only facts visible in the file. Do not guess numbers, dates, property names, contractor names, or status. Use 0 or an empty string when a value is not present. " +
                "Prefer exact dollar amounts and ISO dates. Distinguish submitted construction budget, requested draw amount, approved draw amount, remaining budget, holdback total, and holdback eligible/releasable. " +
                "Identify what is ready for draw submission, what documentation is missing, and which line items need follow-up. " +
                "For expectedNextDrawDate, use the executed Scope of Work milestone/date only when present. " +
                "For photos, describe what evidence the photo does or does not prove for lender requirements."
            }
          ].filter(Boolean)
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "draw_request_extraction",
          strict: true,
          schema: drawExtractionSchema
        }
      }
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "OpenAI extraction failed.");
  }
  return JSON.parse(outputText(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return send(res, 405, { error: "Method not allowed" });
  }

  try {
    await verifyUser(req);
    const contentType = req.headers["content-type"] || "";
    const body = await readRequestBody(req);
    const file = parseMultipart(body, contentType);
    if (!isSupportedFile(file)) {
      return send(res, 400, { error: "Please upload a PDF, Word document, or image file." });
    }
    if (file.data.length > MAX_FILE_BYTES) {
      return send(res, 413, { error: "File is too large. Please upload a document or image under 12 MB." });
    }

    const extraction = await extractWithOpenAI(file);
    return send(res, 200, { extraction });
  } catch (error) {
    return send(res, 400, { error: error.message || "Could not analyze the document." });
  }
};
