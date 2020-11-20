function EncenderRiego () {
    if (NivelDeposito > AlarmaNivelAgua) {
        strip = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
        EncenderRiego()
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
    }
}
function ApagarRiego () {
    strip = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    ApagarRiego()
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
        `)
}
function MedidaSensores () {
    NivelDeposito = pins.analogReadPin(AnalogPin.P2)
    serial.writeValue("niveldeposito", NivelDeposito)
    ValorSensorLluvia = pins.analogReadPin(AnalogPin.P1)
    serial.writeValue("SensorLluvia", ValorSensorLluvia)
    HumedadSuelo = 1023 - pins.analogReadPin(AnalogPin.P0)
    serial.writeValue("HumedadSuelo", HumedadSuelo)
}
function RevisarHumedadSuelo () {
    if (HumedadSuelo < HumedadParaRiego) {
        EncenderRiego()
        while (HumedadSuelo < HumedadParaRiego && ValorSensorLluvia > SensorLluviaMojado) {
            EncenderRiego()
        }
        ApagarRiego()
    }
}
function MostarNivelAgua () {
    if (NivelDeposito < AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else if (NivelDeposito < 1.25 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            # # # # #
            `)
    } else if (NivelDeposito < 1.5 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # . . . #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else if (NivelDeposito < 1.75 * AlarmaNivelAgua) {
        basic.showLeds(`
            # . . . #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    } else {
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
    }
}
let HumedadSuelo = 0
let ValorSensorLluvia = 0
let strip: neopixel.Strip = null
let NivelDeposito = 0
let SensorLluviaMojado = 0
let HumedadParaRiego = 0
let AlarmaNivelAgua = 0
serial.redirectToUSB()
AlarmaNivelAgua = 400
HumedadParaRiego = 500
SensorLluviaMojado = 800
basic.forever(function () {
    MedidaSensores()
    MostarNivelAgua()
    RevisarHumedadSuelo()
})
