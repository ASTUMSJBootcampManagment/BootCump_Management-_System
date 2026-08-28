import API from "../api/axios";

/**
 * Directly downloads the PDF file to the user's computer using the backend stream endpoint.
 * This completely avoids external URL redirects, CORS errors, or timeout issues.
 *
 * @param {string} assignmentIdOrUrl - The Assignment MongoDB ID (preferred) or direct URL
 * @param {string} filename - The preferred filename
 */
export const downloadPdfFile = async (
  assignmentIdOrUrl,
  filename = "assignment.pdf"
) => {
  if (!assignmentIdOrUrl) return;

  const cleanFilename = (
    filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`
  ).replace(/[^a-zA-Z0-9._-]/g, "_");

  try {
    let blob;

    // If it's an assignment ID, download through authenticated backend endpoint
    if (!assignmentIdOrUrl.startsWith("http")) {
      const response = await API.get(
        `/assignments/${assignmentIdOrUrl}/download`,
        {
          responseType: "blob",
        }
      );
      blob = new Blob([response.data], { type: "application/pdf" });
    } else {
      // Direct URL fetch
      const response = await fetch(assignmentIdOrUrl);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      blob = await response.blob();
    }

    // Trigger direct browser file save
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
  } catch (error) {
    console.error("PDF Download error:", error);
    alert(
      "Unable to download PDF. Please ensure the assignment has an attached file."
    );
  }
};
