const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config();

const apiKey = process.env.API_KEY;
const engine_id = "stable-diffusion-xl-1024-v1-0";

const occupations = [
  "Software Engineer",
  "Data Scientist",
  "Graphic Designer",
  "Nurse",
  "Teacher",
  "Accountant",
  "Marketing Manager",
  "Project Manager",
  "Sales Representative",
  "Electrician",
  "Plumber",
  "Chef",
  "Mechanical Engineer",
  "Civil Engineer",
  "Web Developer",
  "Doctor",
  "Pharmacist",
  "Lawyer",
  "Architect",
  "Journalist",
];

const generate = async (occ) => {
  const payload = {
    init_image: fs.createReadStream("base.png"),
    init_image_mode: "IMAGE_STRENGTH",
    image_strength: 0.16,
    "text_prompts[0][text]": `A portrait of child cartoon minimalist [gender],${occ}, [style of cloth] cloth, [details, hat or hair] on the head, minimalist, cartoon style, Doodle NFT Style, simple and big line, outlined art, flat design, [color of the illustration] flash pastel color ligntning, pastel background, portrait, hd, portrait, face profil view, --v 4`,
    cfg_scale: 7,
    samples: 1,
    steps: 30,
  };

  const response = await axios.postForm(
    `https://api.stability.ai/v1/generation/${engine_id}/image-to-image`,
    axios.toFormData(payload, new FormData()),
    {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "image/png",
      },
    }
  );

  if (response.status === 200) {
    fs.writeFileSync(
      `images/${occ ? occ : "normal"}-chicken-${new Date()}.png`,
      Buffer.from(response.data)
    );
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
};

// generate();
occupations.map(async (occ) => {
  await generate(occ);
});
