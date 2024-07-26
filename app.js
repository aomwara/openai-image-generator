const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const sharp = require("sharp");

const apiKey = "";
const model = "dall-e-3";
const prompt =
  " An image of a chicken playing a piano, depicted in a simple and minimalist style using just outlines. The background is random color.";

const convertImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .ensureAlpha() // Add an alpha channel to convert to RGBA
      .toFile(outputPath);
  } catch (error) {
    console.error("Error converting image:", error);
    throw error;
  }
};

const editImage = async () => {
  try {
    // const inputImagePath = "test.png";
    const convertedImagePath = "base-converted.png";

    // Convert the image to RGBA
    // await convertImage(inputImagePath, convertedImagePath);

    const form = new FormData();
    form.append("image", fs.createReadStream(convertedImagePath));
    form.append("prompt", "chicken with doodle style playing a guitar");
    form.append("n", 1);
    form.append("size", "512x512");

    const resp = await axios.post(
      "https://api.openai.com/v1/images/edits",
      form,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...form.getHeaders(),
        },
      }
    );

    const imageUrl = resp.data.data[0].url;

    // Download and save the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(`images/edit-doodle.png`, imageResponse.data);

    console.log(resp.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

const generateImage = async () => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: model,
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const imageUrl = response.data.data[0].url;

    // Download and save the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(`images/chicken_doodle.png`, imageResponse.data);

    console.log(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

generateImage();
// editImage();
