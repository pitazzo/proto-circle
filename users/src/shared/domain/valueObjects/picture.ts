import { Result } from "circle-core";

export class Picture {
  _value: string;

  get value(): string {
    return this._value;
  }

  private constructor(value: string) {
    this._value = value;
  }

  public static create(picture: string): Result<Picture> {
    if (picture === undefined || picture === null || picture.length != 1) {
      return Result.fail<Picture>("Picture has to be just one emoji");
    }
    return Result.ok<Picture>(new Picture(picture));
  }
}
