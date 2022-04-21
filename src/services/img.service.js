import axios from 'axios'

export const imgService = {
  getBgImages,
  getStickers,
  uploadImg,
  uploadVideo,
}

// Upload support

function uploadImg(ev) {
  //Defining our variables
  const UPLOAD_PRESET = 'Trellox_1'
  const CLOUD_NAME = 'trellox'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
  const FORM_DATA = new FormData()
  //Building the request body
  FORM_DATA.append('file', ev.target.files[0]) // form data kind of key : file, add the file we get
  FORM_DATA.append('upload_preset', UPLOAD_PRESET) // add the upload_preset
  //Sending a post method request to Cloudinary`s API
  return fetch(UPLOAD_URL, {
    // add the img to Cloudinary
    method: 'POST',
    body: FORM_DATA,
  })
    .then((res) => res.json())
    .then((res) => res) //return the res
    .catch((err) => console.error(err))
}

function uploadVideo(video) {
  const UPLOAD_PRESET = 'Trellox_1'
  const CLOUD_NAME = 'trellox'
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
  const FORM_DATA = new FormData()
  FORM_DATA.append('file', video)
  FORM_DATA.append('upload_preset', UPLOAD_PRESET)

  return fetch(UPLOAD_URL, {
    method: 'POST',
    body: FORM_DATA,
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => console.error(err))
}

async function getBgImages(search) {
  try {
    const res = await fetch(`https://api.unsplash.com/search?query=${search}&client_id=oMe4LiG85eXMR9Nf7b8cxU6jsTRHCtO81O_MjX-J4L0`, { method: 'GET' })
    return res.json()
  } catch (err) {
    console.log('cannot get images', err)
  }
}

async function getStickers(search) {
  try {
    const res = await fetch(`https://api.giphy.com/v1/stickers/search?api_key=rQgzccXSxZdfKDNtwJwPomi48MFP2ye1&limit=10&q=${search}`, { method: 'GET' })
    return res.json()
  } catch (err) {
    console.log('cannot get stickers', err)
  }
}
