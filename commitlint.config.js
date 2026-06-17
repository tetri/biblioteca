{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 100],
    "footer-leading-blank": [2, "always"],
    "footer-max-line-length": [2, "always", 100],
    "header-max-length": [2, "always", 72],
    "scope-case": [2, "always", "lower-case"],
    "scope-empty": [2, "never"],
    "subject-case": [
      2,
      "never",
      ["start-case", "pascal-case", "upper-case"]
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert"
      ]
    ],
    "scope-enum": [
      2,
      "always",
      [
        "user-service",
        "catalog-service",
        "loan-service",
        "notification-service",
        "gateway",
        "frontend",
        "shared",
        "infra",
        "deps",
        "docs",
        "repo",
        "auth",
        "api",
        "ui",
        "admin",
        "tests"
      ]
    ]
  },
  "helpUrl": "https://github.com/conventional-changelog/commitlint"
}
