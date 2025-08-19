export type LevelObject = {
  playerPos: { x: number; y: number };
  goalPos: { x: number; y: number };
  objects: MyGameObject[];
  background?: BoxProp;
};

export type BoxProp = {
  pos: { x: number; y: number };
  width: number;
  height: number;
};

export type TextProp = {
  pos: { x: number; y: number };
  text: string;
};

export type RopeContactPointProp = {
  pos: { x: number; y: number };
  radius: number;
};

export type MyGameObject = {
  box?: BoxProp;
  ropeContactPoint?: RopeContactPointProp;
  text?: TextProp;
  pickup?: PickupProp;
  shuriken?: ShurikenProp;
};

export type PickupProp = {
  pos: { x: number; y: number };
};

export type ShurikenProp = {
  pos: { x: number; y: number };
};
