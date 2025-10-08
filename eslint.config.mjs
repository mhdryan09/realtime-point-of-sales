import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")];

eslintConfig.push({
	rules: {
		"react-hooks/exhaustive-deps": "off", // untuk mengatasi warning useEffect
		"react/jsx-key": "off", // untuk mengatasi warning key pada map
		"@typescript-eslint/no-explicit-any": "off", // untuk mengatasi warning any pada typescript
		"@typescript-eslint/non-unused-vars": "off", // untuk mengatasi warning unused vars pada typescript
	},
});

export default eslintConfig;
