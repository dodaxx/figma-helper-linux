export interface IFont {
  localizedFamily: string;
  postscript: string;
  style: string;
  weight: string;
  stretch: number;
  italic: boolean;
  family: string;
  localizedStyle: string;
}

export interface IResponse {
  fontFiles: Record<string, IFont[]>;
  version: number;
}