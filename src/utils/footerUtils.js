
export const msToTime = (s) => {
     var ms = s % 1000;
     s = (s - ms) / 1000;
     var secs = s % 60;
     if (secs < 10) { secs = "0" + secs }
     s = (s - secs) / 60;
     var mins = s % 60;
     if (mins < 10) { mins = "0" + mins }


     return mins + ':' + secs;
}
export const cssGetter = (stblTimeOut, stblTimeOutSetting) => {

     const t = stblTimeOutSetting

     if (stblTimeOut > t * 10) {
          return 'sbleTimeOut-ok'
     }
     if (stblTimeOut > t * 9) {
          return 'sbleTimeOut-10'
     }
     if (stblTimeOut > t * 8) {
          return 'sbleTimeOut-9'
     }
     if (stblTimeOut > t * 7) {
          return 'sbleTimeOut-8'
     }
     if (stblTimeOut > t * 6) {
          return 'sbleTimeOut-7'
     }
     if (stblTimeOut > t * 5) {
          return 'sbleTimeOut-6'
     }
     if (stblTimeOut > t * 4) {
          return 'sbleTimeOut-5'
     }
     if (stblTimeOut > t * 3) {
          return 'sbleTimeOut-4'
     }
     if (stblTimeOut > t * 2) {
          return 'sbleTimeOut-3'
     }
     if (stblTimeOut > t * 1) {
          return 'sbleTimeOut-2'
     }

     if (stblTimeOut > 0) {
          return 'sbleTimeOut-1'

     }


}