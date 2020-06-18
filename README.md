# Normalize Volume [![npm Package](https://img.shields.io/npm/v/normalize-volume.svg)](https://www.npmjs.org/package/normalize-volume)
Normalize audio using NodeJs and FFmpeg



## API

```javascript
await NormalizeVolume(input_file, output_file[, options])
```

### input_file   
**Type**: _String_  
Full path to source video file


### output_file   
**Type**: _String_  
Full path to future normalized video file


### options   
**Type**: _Object_  


- ### normalize   
  **Type**: _Boolean_  
  **Default**: `true`  
  Base on [Loudness Normalization](https://trac.ffmpeg.org/wiki/AudioVolume#LoudnessNormalization)


- ### volume   
  **Type**: _Number_  
  **Default**: `0.5`  
  Number starts with 0. Volume `0 = muted`, `2 = 200%`. Ignored if `normalize = true`   


- ### ffmpeg_bin   
  **Type**: _String_  
  **Default**: `ffmpeg`  
  Path to [FFmpeg](http://ffmpeg.org/download.html) binary file


- ### convert_bin   
  **Type**: _String_  
  **Default**: `convert`  
  Path to [ImageMagick Convert](https://imagemagick.org/) binary file


- ### waveform   
  **Type**: _Object_  
  **Default**: `null`  
  Optional visualization of the normalization result. In short, it is a waveforms before and after normalization, merged together.
  ![waveform](https://raw.githubusercontent.com/tpkn/normalize-volume/master/waveform.png)
  
  To customize waveform, use this options:   
  
  | Option | Type | Default | What for? |
  | ------ | :------: | ------ | ------ |
  | `image_before` | _String_ | `output_file + '_before.png'` |  |
  | `image_after` | _String_ | `output_file + '_after.png'` |  |
  | `image_comparison` | _String_ | `output_file + '_comparison.png'` |  |
  | `width` | _Number_ | 400 |  |
  | `height` | _Number_ | 225 |  |
  | `before_color` | _String_ | white | 'before' waveform color |
  | `after_color` | _String_ | #ff00b3 | 'after' waveform color |


- ### silent   
  **Type**: _Boolean_  
  **Default**: `true`  
  Enables logging `stdout` / `stderr` data  


### @return
**Type**: _Object_  
```javascript
{
   "file": "z:\test_normalized.mp4",
   "waveform": "z:\test.mp4_comparison.png"
}
```


## Usage   
```javascript
const NormalizeVolume = require('normalize-volume');

let options = {
   normalize: true, 
   waveform: { width: 1400, height: 225 },
   ffmpeg_bin: 'ffmpeg.exe', 
   convert_bin: 'convert.exe'
}

NormalizeVolume('z:/test.mp4', 'z:/test_normalized.mp4', options)
.then(result => {
   console.log(result);
})
.catch(err => {
   console.log(err);
})
```
