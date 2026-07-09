import puppeteer from 'puppeteer'

async function takeHighResolutionScreenshot(
  url,
  outputPath,
  className,
  width = 3840,
  height = 2160,
  deviceScaleFactor = 2
) {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Set the viewport with desired width, height, and device scale factor for retina effect
    await page.setViewport({
      width: width,
      height: height,
      deviceScaleFactor: deviceScaleFactor
    })

    // Navigate to the local website
    await page.goto(url, { waitUntil: 'load' })

    // Wait for a short period to ensure the page is fully rendered (adjust as needed)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const element = await page.$(className)
    if (!element) {
      throw new Error(`Element with class "${className}" not found`)
    }

    // Take a screenshot of the element
    await element.screenshot({ path: outputPath })

    console.log(
      `Screenshot of element with class "${className}" saved to ${outputPath}`
    )

    await browser.close()
  } catch (error) {
    console.error('Error taking screenshot:', error)
  }
}

// --- Configuration ---
const localWebsiteURL = 'http://localhost:3000/test4' // Replace with the actual URL of your localhost website
const screenshotOutputPath = 'high_resolution_screenshot.png'
const targetClassName = '.screenshot-target'
const targetWidth = 3840 // Example 4K width
const targetHeight = 2160 // Example 4K height
const retinaScaleFactor = 2 // Simulates a Retina display (2x pixel density)

// --- Run the script ---
takeHighResolutionScreenshot(
  localWebsiteURL,
  screenshotOutputPath,
  targetClassName,
  targetWidth,
  targetHeight,
  retinaScaleFactor
)
