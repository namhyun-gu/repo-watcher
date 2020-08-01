import en from "./locale/en.json";
import ko from "./locale/ko.json";

export default function (languageCode: string) {
  if (languageCode == "en") return en;
  else if (languageCode == "ko") return ko;
  else throw Error(`Not supported language\n${languageCode}`);
}
