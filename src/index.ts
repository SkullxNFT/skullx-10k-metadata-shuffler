import openSeaMetadata from './data/baseOpenSeaMetadata.json';
import originsMintedIds from './data/originsMintedIds.json'
import { shuffle, swapArrayElements } from "./utils";
import fs from "fs";
import crypto from 'crypto';
import { OpenSeaMetadata } from "./types";

let metadata = openSeaMetadata;
let originsIds = originsMintedIds;

// Special presets
const teamLength = 3
const specialsLength = 20

// Split up specials and the rest before shuffle
const teamMetadata = metadata.splice(0, teamLength)
const specialsMetadata = metadata.splice(0, specialsLength)

// Shuffle metadata and origin IDs 10K times
for (let i = 0; i < 10000; i++) {
  metadata = shuffle(metadata)
  originsIds = shuffle(originsIds)
}

// Select 20 first IDs from the shuffled list
const selectedOriginIds = originsIds.slice(0, specialsLength)

// Merge specials and shuffled metadata back
metadata = teamMetadata.concat(specialsMetadata, metadata)

// Swap specials with their new selected IDs
for (let i = 0; i < specialsLength; i++) {
  const animatedIndex = i + teamLength;
  // Use 'selectedOriginIds[i] - 1' since Skullx IDs starts at 1
  swapArrayElements(metadata, animatedIndex, selectedOriginIds[i] - 1)
}

// Map final metadata with name and token ID
const finalMetadata: OpenSeaMetadata[] = metadata.map((item, index) => {
  const data: OpenSeaMetadata = {
    // Skullx IDs start at 1
    name: `Skullx #${index + 1}`,
    tokenId: index + 1,
    ...item
  }
  return data;
})

// Write final metadata to file
const data = JSON.stringify(finalMetadata);
fs.writeFileSync("src/finalMetadata.json", data);

// Create provenance string and hash
const provenanceString = ''.concat(...finalMetadata.map(item => item.imageHash))
const hash = crypto.createHash('sha256');
const provenanceHash = hash.update(provenanceString).digest('hex')

console.log('provenanceHash', provenanceHash)

// Write provenance string and hash
fs.writeFileSync("src/provenanceString.txt", provenanceString);
fs.writeFileSync("src/provenanceHash.txt", provenanceHash);
