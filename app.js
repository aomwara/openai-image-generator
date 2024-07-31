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

const rarityLevels = [
  { name: "Common", weight: 50 },
  { name: "Uncommon", weight: 25 },
  { name: "Rare", weight: 15 },
  { name: "Epic", weight: 7 },
  { name: "Legendary", weight: 3 },
];

const getRandomRarity = () => {
  const totalWeight = rarityLevels.reduce(
    (acc, rarity) => acc + rarity.weight,
    0
  );
  let random = Math.random() * totalWeight;

  for (let rarity of rarityLevels) {
    if (random < rarity.weight) {
      return rarity.name;
    }
    random -= rarity.weight;
  }
};

const getRandomOccupation = () => {
  const randomIndex = Math.floor(Math.random() * occupations.length);
  return occupations[randomIndex];
};

const generate = async (occ, rarity, id) => {
  const payload = {
    init_image: fs.createReadStream("base.png"),
    init_image_mode: "IMAGE_STRENGTH",
    image_strength: 0.16,
    "text_prompts[0][text]": `A portrait of child cartoon minimalist [gender],${occ}, [style of cloth] cloth, [details, hat or hair] on the head, minimalist, cartoon style, Doodle NFT Style, simple and big line, outlined art, flat design, [color of the illustration] flash pastel color ligntning, pastel background, portrait, hd, portrait, face profil view, --v 4`,
    cfg_scale: 7,
    samples: 1,
    steps: 30,
  };

  try {
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
        `images/${occ}-${rarity}-${Date.now()}.png`,
        Buffer.from(response.data)
      );
      console.log(`Generated image for ${occ} with rarity ${rarity}`);
      // Create metadata for the image
      // createMetadataFile(id, occ, rarity, imageName);
    } else {
      console.error(`Error ${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
  }
};

const createMetadataFile = (id, occupation, rarity, imageName) => {
  const metadata = {
    name: `Chicken #${id}`,
    description: "Chicken NFT JIBBER Chain!",
    image: `https://metadata.chicker.io/${id}.json`,
    attributes: [
      {
        trait_type: "occupation",
        value: occupation,
      },
      {
        trait_type: "rarity",
        value: rarity,
      },
    ],
  };

  fs.writeFileSync(`metadata/${id}.json`, JSON.stringify(metadata, null, 2));
  console.log(`Created metadata for #${id}`);
};

const generateImages = async () => {
  const rarityCounts = {
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
  };

  const occupationCounts = occupations.reduce((acc, occupation) => {
    acc[occupation] = 0;
    return acc;
  }, {});

  for (let i = 0; i < 10000; i++) {
    const occupation = getRandomOccupation();
    const rarity = getRandomRarity();

    // Increment the count for the selected rarity
    rarityCounts[rarity]++;
    occupationCounts[occupation]++;

    // Uncomment the next line to enable image generation
    //await generate(occupation, rarity, i + 1);
  }

  console.log("Rarity Counts:", rarityCounts);
  console.log("Occupation Counts:", occupationCounts);
};
generateImages();
