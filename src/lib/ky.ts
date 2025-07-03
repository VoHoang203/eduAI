import ky from "ky";

const baseURL = typeof window === "undefined"
  ? process.env.NEXT_PUBLIC_BASE_URL
  : "";

const kyInstance = ky.create({
  prefixUrl: baseURL,
  parseJson: (text) =>
    JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    }),
});

export default kyInstance;