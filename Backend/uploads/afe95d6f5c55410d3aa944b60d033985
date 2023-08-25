/* Task
You will be given a string of English digits "stuck" together, like this:

"zeronineoneoneeighttwoseventhreesixfourtwofive"

Your task is to split the string into separate digits:

"zero nine one one eight two seven three six four two five"

Examples
"three"              -->  "three"
"eightsix"           -->  "eight six"
"fivefourseven"      -->  "five four seven"
"ninethreesixthree"  -->  "nine three six three"
"fivethreefivesixthreenineonesevenoneeight"  --> */

function uncollapse(digits){
  return digits.replace(/(zero|one|two|three|four|five|six|seven|eight|nine)/gm,'$1 ').trim();
}