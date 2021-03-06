// @flow
export default `
@font-face {
  font-family: "Roboto Self";
  font-style: normal;
  font-weight: 100;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-100.woff2") format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-100.woff") format("woff"),
    local("Roboto Thin"), local("Roboto-Thin");
}
@font-face {
  font-family: "Roboto Self";
  font-style: italic;
  font-weight: 100;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-100italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-100italic.woff") format("woff"),
    local("Roboto Thin Italic"), local("Roboto-ThinItalic");
}
@font-face {
  font-family: "Roboto Self";
  font-style: normal;
  font-weight: 300;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-300.woff2") format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-300.woff") format("woff"),
    local("Roboto Light"), local("Roboto-Light");
}
@font-face {
  font-family: "Roboto Self";
  font-style: italic;
  font-weight: 300;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-300italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-300italic.woff") format("woff"),
    local("Roboto Light Italic"), local("Roboto-LightItalic");
}
@font-face {
  font-family: "Roboto Self";
  font-style: normal;
  font-weight: 400;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-regular.woff2")
      format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-regular.woff") format("woff"),
    local("Roboto"), local("Roboto-Regular");
}
@font-face {
  font-family: "Roboto Self";
  font-style: italic;
  font-weight: 400;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-italic.woff") format("woff"),
    local("Roboto Italic"), local("Roboto-Italic");
}
@font-face {
  font-family: "Roboto Self";
  font-style: normal;
  font-weight: 500;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-500.woff2") format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-500.woff") format("woff"),
    local("Roboto Medium"), local("Roboto-Medium");
}
@font-face {
  font-family: "Roboto Self";
  font-style: italic;
  font-weight: 500;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-500italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-500italic.woff") format("woff"),
    local("Roboto Medium Italic"), local("Roboto-MediumItalic");
}
@font-face {
  font-family: "Roboto Self";
  font-style: normal;
  font-weight: 700;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-700.woff2") format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-700.woff") format("woff"),
    local("Roboto Bold"), local("Roboto-Bold");
}
@font-face {
  font-family: "Roboto Self";
  font-style: italic;
  font-weight: 700;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-700italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-700italic.woff") format("woff"),
    local("Roboto Bold Italic"), local("Roboto-BoldItalic");
}
@font-face {
  font-family: "Roboto Self";
  font-style: normal;
  font-weight: 900;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-900.woff2") format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-900.woff") format("woff"),
    local("Roboto Black"), local("Roboto-Black");
}
@font-face {
  font-family: "Roboto Self";
  font-style: italic;
  font-weight: 900;
  src: url("/static/assets/fonts/Roboto/roboto-v19-latin-900italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/Roboto/roboto-v19-latin-900italic.woff") format("woff"),
    local("Roboto Black Italic"), local("Roboto-BlackItalic");
}

@font-face {
  font-family: "Roboto Mono Self";
  font-style: normal;
  font-weight: 100;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-100.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-100.woff")
      format("woff"),
    local("Roboto Mono Thin"), local("RobotoMono-Thin");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: italic;
  font-weight: 100;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-100italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-100italic.woff")
      format("woff"),
    local("Roboto Mono Thin Italic"), local("RobotoMono-ThinItalic");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: normal;
  font-weight: 300;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-300.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-300.woff")
      format("woff"),
    local("Roboto Mono Light"), local("RobotoMono-Light");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: italic;
  font-weight: 300;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-300italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-300italic.woff")
      format("woff"),
    local("Roboto Mono Light Italic"), local("RobotoMono-LightItalic");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: normal;
  font-weight: 400;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-regular.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-regular.woff")
      format("woff"),
    local("Roboto Mono"), local("RobotoMono-Regular");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: italic;
  font-weight: 400;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-italic.woff")
      format("woff"),
    local("Roboto Mono Italic"), local("RobotoMono-Italic");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: normal;
  font-weight: 500;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-500.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-500.woff")
      format("woff"),
    local("Roboto Mono Medium"), local("RobotoMono-Medium");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: italic;
  font-weight: 500;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-500italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-500italic.woff")
      format("woff"),
    local("Roboto Mono Medium Italic"), local("RobotoMono-MediumItalic");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: normal;
  font-weight: 700;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-700.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-700.woff")
      format("woff"),
    local("Roboto Mono Bold"), local("RobotoMono-Bold");
}
@font-face {
  font-family: "Roboto Mono Self";
  font-style: italic;
  font-weight: 700;
  src: url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-700italic.woff2")
      format("woff2"),
    url("/static/assets/fonts/RobotoMono/roboto-mono-v6-latin-700italic.woff")
      format("woff"),
    local("Roboto Mono Bold Italic"), local("RobotoMono-BoldItalic");
}
`
