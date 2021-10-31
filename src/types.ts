export interface OpenSeaMetadataBase {
  image: string;
  imageHash: string;
  attributes: OpenSeaAttribute[];
}

export interface OpenSeaMetadata extends OpenSeaMetadataBase {
  name: string;
  description?: string;
  tokenId: number;
}

export interface OpenSeaAttribute {
  trait_type: string;
  value: string;
}
