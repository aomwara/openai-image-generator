const axios = require("axios");
const fs = require("fs");

const apiKey = "your-api-key";
const model = "dall-e-3";
const prompt = " your-prompt";

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
