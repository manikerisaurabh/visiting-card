const { ocrSpace } = require("ocr-space-api-wrapper");
const mongoose = require("mongoose");
const VisitingCard = require("../models/visitingCard.model.js"); // Adjust path as needed
const { connectToMongoDB } = require("../db/connectToDb.js");

const uploadImageController = async (req, res) => {
  try {
    console.log("Request hit");
    const { user, cardImage, cardName } = req.body;

    if (!cardImage) {
      return res.status(400).json({ error: "cardImage URL is required" });
    }

    // Extract text using ocrSpace
    const ocrResult = await ocrSpace(cardImage);
    const extractedText = ocrResult?.ParsedResults?.[0]?.ParsedText;

    if (!extractedText) {
      return res
        .status(400)
        .json({ error: "Failed to extract text from image" });
    }

    console.log("Extracted Text:", extractedText);

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Parse the extracted text into structured data
    const parsedData = parseCardText(extractedText);
    console.log({ parsedData });
    if (!parsedData) {
      return res
        .status(400)
        .json({ error: "Unable to parse visiting card details" });
    }

    // Ensure user ID is properly converted to ObjectId
    const userId = new mongoose.Types.ObjectId(user);
    await connectToMongoDB();

    // Save to MongoDB
    const visitingCard = new VisitingCard({
      user: userId,
      cardImage,
      cardName,
      ...parsedData,
    });

    await visitingCard.save();

    return res.status(201).json({
      message: "Visiting card data saved successfully",
      visitingCard,
    });
  } catch (error) {
    console.error("Error in uploadImageController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Enhanced helper function to parse text extracted from the visiting card
function parseCardText(text) {
  try {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line); // Remove empty lines

    let name,
      contact = [],
      email,
      website,
      company,
      designation,
      address = "";

    for (const line of lines) {
      // Identify phone numbers
      if (/^\+?[0-9\s\-().]+$/.test(line)) {
        contact.push(line);
      }
      // Identify email addresses
      else if (
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(line)
      ) {
        email = line;
      }
      // Identify website URLs
      else if (/^(www\.|https?:\/\/)[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(line)) {
        website = line;
      }
      // Identify name (assumes name is at the top of the card)
      else if (!name && /^[A-Za-z\s]+$/.test(line)) {
        name = line;
      }
      // Identify company (basic keywords)
      else if (/LLC|Inc|Company|Corp|Ltd|Co\b/i.test(line)) {
        company = line;
      }
      // Identify designation
      else if (/Manager|Engineer|Director|Agent|REALTOR/i.test(line)) {
        designation = line;
      }
      // Treat remaining lines as address
      else {
        address += `${line} `;
      }
    }

    return {
      name: name || "N/A",
      contact: contact.join(", ") || "N/A",
      email: email || "N/A",
      website: website || "N/A",
      company: company || "N/A",
      designation: designation || "N/A",
      address: address.trim() || "N/A",
    };
  } catch (err) {
    console.error("Error parsing card text:", err);
    return null;
  }
}

module.exports = {
  uploadImageController,
};
