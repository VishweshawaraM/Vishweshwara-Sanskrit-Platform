import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "src/db/migrations/**"],
  },
  {
    rules: {
      // Underscore prefix marks a parameter as deliberately unused.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // The domain layer must never import from the framework.
    // docs/08-technical-architecture.md §2 rule 1.
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*", "react", "react-dom"],
              message:
                "Framework imports are not permitted in the domain layer. See docs/08-technical-architecture.md §2.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
