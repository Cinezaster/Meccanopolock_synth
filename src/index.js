import waveGenerator from './generators/waveGenerator.js'
import easeFunction from './generators/easeFunction.js'
import fs from 'fs-extra'
import { createSVGWindow } from 'svgdom'
import SVGJS from '@svgdotjs/svg.js'
const { SVG, registerWindow, Color } = SVGJS

const steps = 3000

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

const fourrierArray = (samplingRate) => {
  const arr = new Array(samplingRate)
  for (let index = 0; index < arr.length; index++) {
    arr[index] = Math.random() * 4
  }
  return arr
}

const splashGenerator = (startHue, endHue, samplingRate) => {
  const startColor = new Color({ h: startHue, s: 100, l: 50 })
  const endColor = new Color({ h: endHue, s: 100, l: 50 })

  const a = fourrierArray(samplingRate)
  const ar = getRandomInt(1, 10)
  const b = fourrierArray(samplingRate)
  const br = getRandomInt(1, 10)
  const c = fourrierArray()
  const cr = getRandomInt(1, 20)
  const d = fourrierArray()
  const dr = getRandomInt(1, 10)

  const maxThickness = 10
  const artArray = []

  for (let index = 0; index < steps; index++) {
    const t = index / steps

    const sweeperWave = waveGenerator(t * 2 * Math.PI, a, ar)
    const sweeperEasedWave = easeFunction(t, sweeperWave)
    const sweeperAngle = (sweeperEasedWave + 1) * ((Math.PI / 2) / 2) // highest value = 2

    const sliderWave = waveGenerator(t * 2 * Math.PI, b, br)
    const sliderEasedWave = easeFunction(t, sliderWave)
    const sliderPosition = (sliderEasedWave + 1) * (100 / 2) // highest value = 2

    const colorWave = waveGenerator(t * 2 * Math.PI, c, cr)
    const colorPos = (colorWave + 1) / 2
    const thicknessWave = waveGenerator(t * 2 * Math.PI, d, dr)
    const easedThicknessWave = easeFunction(t, thicknessWave)
    const thickness = (easedThicknessWave + 1) * (maxThickness / 2)
    const hslColor = new Color(startColor.toHex()).to(endColor.toHex())
    const color = hslColor.at(colorPos)

    artArray[index] = {
      sweeper: sweeperAngle,
      slider: sliderPosition,
      color,
      thickness,
      x: ((sliderPosition) * Math.sin(sweeperAngle)) * 4,
      y: ((sliderPosition) * Math.sin((Math.PI / 2) - sweeperAngle)) * 4
    }
  }
  return artArray
}

const startHue = getRandomInt(0, 361)
const endHue = (startHue + 30) % 360 // getRandomInt(0, 361)
const samplingRate = getRandomInt(1, 6)

const artArrayA = splashGenerator(startHue, endHue, samplingRate)
const artArrayB = splashGenerator((startHue + 120) % 360, (endHue + 120) % 360, samplingRate)
const artArrayC = splashGenerator((startHue + 240) % 360, (endHue + 240) % 360, samplingRate)

const artArray = [...artArrayA, ...artArrayB]

const window = createSVGWindow()
const document = window.document
// register window and document
registerWindow(window, document)

// create canvas
const canvas = SVG(document.documentElement).size(600, 600)

for (let index = 1; index < artArray.length; index++) {
  const point = artArray[index]
  const previousPoint = artArray[index - 1]
  canvas.line(previousPoint.x, previousPoint.y, point.x, point.y).dmove(20, 20).stroke({
    width: point.thickness,
    color: point.color.toHex(),
    linecap: 'round'
  }).fill(point.color.toHex())
}
canvas.children().sort((a, b) => {
  const strokeA = a.attr('stroke-width')
  const strokeB = b.attr('stroke-width')
  const diff = strokeA - strokeB
  if (diff < 0) {
    a.insertBefore(b)
  } else if (diff > 0) {
    a.insertAfter(b)
  }
})

// get your svg as string
fs.outputFile('art.svg', canvas.svg())
