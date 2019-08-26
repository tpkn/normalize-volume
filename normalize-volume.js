/*!
 * Normalize Volume, http://tpkn.me/
 */
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

function NormalizeVolume(input_file, output_file, options = {}){
   return new Promise((resolve, reject) => {
      let { 
         
         volume = 0.5, 
         normalize = true, 
         ffmpeg_bin = 'ffmpeg', 
         convert_bin = 'convert',
         waveform,
         silent = true

      } = options;
      
      let result = { file: output_file };
      let cmd = [];

      // Normalize or just change the volume
      if(normalize){
         cmd.push(`"${ffmpeg_bin}" -i "${input_file}" -y -c:v libx264 -c:a aac -ar 44100 -vcodec copy -filter:a loudnorm=print_format=json "${output_file}"`);
      }else{
         cmd.push(`"${ffmpeg_bin}" -i "${input_file}" -y -filter:a "volume=${volume}" "${output_file}"`);
      }

      // Create two waveforms (before and after converting) merged together for comparison
      if(waveform){
         let { 
            image_before = output_file + '_before.png',
            image_after = output_file + '_after.png',
            image_comparison = output_file + '_comparison.png',
            width = 400, 
            height = 225, 
            before_color = 'white', 
            after_color = '#ff00b3', 
         } = waveform;

         // 'Before' waveform
         cmd.unshift(`"${ffmpeg_bin}" -i "${input_file}" -y -filter_complex "showwavespic=s=${width}x${height}:colors=${before_color}:split_channels=1" -frames:v 1 "${image_before}"`);
         // 'After' waveform
         cmd.push(`"${ffmpeg_bin}" -i "${output_file}" -y -filter_complex "showwavespic=s=${width}x${height}:colors=${after_color}:split_channels=1" -frames:v 1 "${image_after}"`);
         // Merging
         cmd.push(`"${convert_bin}" "${image_before}" "${image_after}" -gravity NorthEast -composite "${image_comparison}"`);
         // Cleanup a bit
         cmd.push(`del /f ${image_before}`);
         cmd.push(`del /f ${image_after}`);

         result.waveform = image_comparison;
      }
      

      let child = spawn(cmd.join(' && '), { shell: true });

      child.stdout.on('data', (data) => {
         if(!silent){
            console.log(`${data}`);
         }
      });

      child.stderr.on('data', (data) => {
         if(!silent){
            console.log(`${data}`);
         }
      });

      child.on('exit', (exitCode) => {
         child.stdin.pause();
         child.kill();
         
         if(exitCode == 0){
            resolve(result);
         }else{
            reject('exit code ' + exitCode);
         }
      });

   })
}

module.exports = NormalizeVolume;
