export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // I have added a \ before the backtick on the 3rd line of the art
    const art = String.raw`
    _   _             _      ____ _                _
   | \ | |_   ___  _| |_   / ___| |__   __ _ _ __| |_ ___
   |  \| | | | \ \/ / __| | |   | '_ \ / _\` | '__| __/ __|
   | |\  | |_| |>  <| |_  | |___| | | | (_| | |  | |_\__ \
   |_| \_|\__,_/_/\_\\__|  \____|_| |_|\__,_|_|   \__|___/
    `

    console.log(
      `%c${art}`,
      'color: #00DC82; font-weight: bold;'
    )
  }
})
