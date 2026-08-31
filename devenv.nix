{
  pkgs,
  inputs,
  ...
}:
let
  pkgs-playwright = import inputs.nixpkgs-playwright { system = pkgs.stdenv.system; };
  browsers =
    (builtins.fromJSON (builtins.readFile "${pkgs-playwright.playwright-driver}/browsers.json"))
    .browsers;
  chromium-rev = (builtins.head (builtins.filter (x: x.name == "chromium") browsers)).revision;
in
{
  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };
  packages = with pkgs; [
    lefthook
  ];

  env = {
    PLAYWRIGHT_BROWSERS_PATH = "${pkgs-playwright.playwright.browsers}";
    PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
    PLAYWRIGHT_NODEJS_PATH = ./node_modules/node;
    PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH = "${pkgs-playwright.playwright.browsers}/chromium-${chromium-rev}/chrome-linux/chrome";
  };

  scripts.intro.exec = ''
    playwrightNpmVersion=$(node -p "require('@playwright/test/package.json').version" 2>/dev/null)
    nixPlaywrightBaseVersion=$(echo "${pkgs-playwright.playwright.version}" | cut -d. -f1,2)
    npmPlaywrightBaseVersion=$(echo "$playwrightNpmVersion" | cut -d. -f1,2)
    if [ "$nixPlaywrightBaseVersion" != "$npmPlaywrightBaseVersion" ]; then
        echo "❌ Playwright versions in nix ($nixPlaywrightBaseVersion in devenv.yaml) and npm ($npmPlaywrightBaseVersion in package.json) are not the same! Please adapt the configuration."
    fi
		lefthook install
  '';

  enterShell = ''
    intro
  '';
}
