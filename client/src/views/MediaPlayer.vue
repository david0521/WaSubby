<template>
    <div class="background">

        <div>
            <h1 class="my-3">Play media</h1>
            <p v-if="languages.length > 0" class="mb-5"> Supported languages are {{ languages }}</p>
            <b-form v-if="!media" @submit="submitFile">
                <input type="file" ref="file" />
                <div class="mt-3"> <b-button @click="submitFile">Upload!</b-button></div>
            </b-form>

            <div v-if="processing">
                <b-spinner />
                <p>Subtitles are being generated...<br />
                    Depending on the size of the media, this might take several minutes</p>
            </div>

            <!-- This has to be a video tag, otherwise we can't display subtitles -->
            <video id="audio" v-show="media && mediaType === 'audio' && !processing" controls ref="audioplayer"
                crossorigin="anonymous" preload="metadata">
                <track kind="captions" v-for="subtitle in subtitles" :key="subtitle.id" :src="subtitle.path"
                    :srclang="subtitle.language.code" :label="subtitle.language.name">
            </video>

            <video id="video" v-show="media && mediaType === 'video' && !processing" controls ref="videoplayer"
                crossorigin="anonymous" preload="metadata">
                <track kind="captions" v-for="subtitle in subtitles" :key="subtitle.id" :src="subtitle.path"
                    :srclang="subtitle.language.code" :label="subtitle.language.name">
            </video>

            <div v-show="media && !processing">
                <div class="d-flex flex-column align-items-center upload-sub-container">
                <h2 class="mb-3">Upload New Subtitle</h2>
                <b-form id="subtitleForm" @submit="submitSubtitles">
                    <input type="file" ref="subtitleUpload" />
                    <div>Language:
                        <b-form-select id="language-select" size="sm" v-model="selectedSubUploadLang"
                            :options="languageData.map(lang => lang.name)"></b-form-select>
                    </div>
                    <div class="mt-3">
                        <b-button @click="submitSubtitles">Upload Subtitle</b-button>
                    </div>
                </b-form>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import fixSubs from '@/subtitle-fix'
export default {
  data: () => ({ mediaHash: null, media: null, mediaType: null, subtitles: [], processing: false, languages: '', languageData: [], selectedSubUploadLang: 'English' }),
  async mounted() {
    fixSubs(2)
    const res = await this.$httpClient.get('/v1/languages')
    this.languages = res.data.map(lang => lang.name).join(', ')
    this.languageData = res.data
  },
  updated: function () {
    fixSubs(this.subtitles.length)
    this.showAllSubs()
  },
  methods: {
    async submitSubtitles() {
      console.log('submitting subtitles')

      const formData = new FormData()
      formData.append('subtitles', this.$refs.subtitleUpload.files[0])
      formData.append('languageName', this.selectedSubUploadLang)
      console.log(this.selectedSubUploadLang)
      console.log(this.languageData.filter(lang => lang.name === this.selectedSubUploadLang)[0])
      formData.append('languageCode', this.languageData.filter(lang => lang.name === this.selectedSubUploadLang)[0].code)
      const headers = { 'Content-Type': 'multipart/form-data' }

      await this.$httpClient.post(`/v1/medias/${this.mediaHash}/subtitles`, formData, { headers })
      await this.loadSubtitles()
      this.$bvToast.toast('Subtitle added!', {
        title: 'Success',
        autoHideDelay: 5000,
        variant: 'success',
        appendToast: true
      })
    },
    async submitFile() {
      this.media = this.$refs.file.files[0]

      if (this.media.type.startsWith('video')) {
        this.mediaType = 'video'
      } else if (this.media.type.startsWith('audio')) {
        this.mediaType = 'audio'
      } else {
        this.$bvToast.toast('This media file type is not supported', {
          title: 'Unsupported media',
          autoHideDelay: 5000,
          variant: 'danger',
          appendToast: true
        })
        this.media = null
        return
      }

      console.log('detected mediaType: ' + this.mediaType)

      const formData = new FormData()
      formData.append('media', this.media)
      const headers = { 'Content-Type': 'multipart/form-data' }

      this.processing = true
      const res = await this.$httpClient.post('/v1/medias', formData, { headers })
      this.mediaHash = res.data.fileHash
      console.log('mediaHash:')
      console.log(this.mediaHash)

      const reader = new FileReader()
      reader.readAsDataURL(this.media)
      reader.addEventListener('load', () => {
        if (this.mediaType === 'video') { this.$refs.videoplayer.src = reader.result }
        if (this.mediaType === 'audio') { this.$refs.audioplayer.src = reader.result }
      })
      this.loadSubtitles()
    },
    showAllSubs() {
      for (const textTrack of this.$refs.audioplayer.textTracks) {
        textTrack.mode = 'showing'
      }
      for (const textTrack of this.$refs.videoplayer.textTracks) {
        textTrack.mode = 'showing'
      }
    },
    async loadSubtitles() {
      let waiting = true
      while (waiting) {
        try {
          const res = await this.$httpClient.get(`/v1/medias/${this.mediaHash}`)
          waiting = res.data.processing
        } catch (err) {
          this.$bvToast.toast(err.message, {
            title: 'Error',
            autoHideDelay: 5000,
            variant: 'danger',
            appendToast: true
          })
        }
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // get subtitles URLs
      const res = await this.$httpClient.get(`/v1/medias/${this.mediaHash}/subtitles`)
      const subs = res.data
      for (const sub of subs) {
        sub.path = `${process.env.VUE_APP_API_ENDPOINT}${sub.path}`
      }
      this.subtitles = subs
      //   this.$forceUpdate()
      fixSubs(this.subtitles.length)
      this.processing = false
    }
  }
}
</script>
<style scoped>
#language-select {
    max-width: 7rem;
}

#subtitleForm {
    width: 100%;
    max-width: 80vw;
}

.background {
    /* padding-top: 6rem; */
    margin: 0;
    background: var(--account-light);
    color: var(--letter);
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

video {
    width: 100%;
    max-width: 1200px;
}

.upload-sub-container {
    padding-top: 10rem;
    padding-bottom: 10rem;
}

</style>
