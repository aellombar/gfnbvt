import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...coreWebVitals,
  {
    // eslint-plugin-react's "detect" path is not compatible with ESLint 10,
    // so pin the version explicitly to skip runtime detection.
    settings: { react: { version: "19.2" } },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];

export default eslintConfig;
