<template>
  <video id="myVideo" class="video-js vjs-default-skin" playsinline></video>
</template>

<script>
/* eslint-disable */
import 'video.js/dist/video-js.css'
import 'videojs-record/dist/css/videojs.record.css'
import videojs from 'video.js'

import 'webrtc-adapter'
import RecordRTC from 'recordrtc'

import { imgService } from '../../services/img.service.js'

import Record from 'videojs-record/dist/videojs.record.js'

export default {
  data() {
    return {
      player: '',
      options: {
        controls: true,
        autoplay: false,
        fluid: false,
        loop: false,
        width: 320,
        height: 240,
        bigPlayButton: false,
        controlBar: {
          volumePanel: false,
        },
        plugins: {
          // configure videojs-record plugin
          record: {
            audio: true,
            video: true,
            debug: true,
          },
        },
      },
    }
  },
  mounted() {
    /* eslint-disable no-console */
    this.player = videojs('#myVideo', this.options, () => {
      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION + ' with videojs-record ' + videojs.getPluginVersion('record') + ' and recordrtc ' + RecordRTC.version
      videojs.log(msg)
    })

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!')
    })

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!')
    })
    this.player.on('finishRecord', () => {
      console.log('finished recording: ', this.player.recordedData)
      this.upload(this.player.recordedData)
    })

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error)
    })

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode)
    })
  },
  methods: {
    async upload(value) {
      var url = await imgService.uploadVideo(value)
      this.$emit('videoUrl', url)
    },
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
}
</script>
