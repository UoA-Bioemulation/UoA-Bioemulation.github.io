<?php

define("PER_ROW", 3);
define("MAX_DP", 2);

if($argc !== 2) {
    die("No input file provided.");
}

$in = $argv[1];

$out = $in;
if(strrpos($out, ".") > -1) {
    $out = substr($out, 0, strrpos($out, "."));
}
$out = $out . ".html";

$data = Array();
$file = fopen($in, "r");
while(!feof($file)) {
    $data[] = fgetcsv($file);
}

fclose($file);

$sorted = Array();
$max_len = Array();
for($i=0; $i<sizeof($data); $i++) {
    if(sizeof($data[$i]) > 0) {
        $valid = true;

        for($j=0; $j<sizeof($data[$i]); $j++) {
            if(is_numeric($data[$i][$j]))
                continue;

            if(is_null($data[$i][$j]) || strlen($data[$i][$j]) === 0)
                continue;

            $valid = false;
            break;
        }

        if($valid) {
            $tmp = $data[$i];

            if(sizeof($max_len) === 0) {
                $max_len = array_fill(0, sizeof($tmp), 0);
            }

            if(sizeof($tmp) === sizeof($max_len)) {
                for($j=0; $j<sizeof($tmp); $j++) {
                    if(is_numeric($tmp[$j]))
                        $tmp[$j] = (string)round($tmp[$j], MAX_DP);

                    if(is_null($tmp[$j]) || strlen($tmp[$j]) === 0)
                        $tmp[$j] = "null";;

                    $len = strlen($tmp[$j]);
                    if($len > $max_len[$j])
                        $max_len[$j] = $len;
                }

                $sorted[] = $tmp;    
            }
        }
    }
}

$output = '';

for($i=0; $i<sizeof($sorted); $i++) {
    if($i > 0)
        $output .= ", ";

    if($i % PER_ROW == 0 && $i > 0) {
        $output .= "\n";
    }

    $output .= "[";
    for($j=0; $j<sizeof($sorted[$i]); $j++) {
        if($j > 0)
            $output .= ", ";

        $str = $sorted[$i][$j];

        while(strlen($str) < $max_len[$j]) {
            $str = " " . $str;
        }

        $output .= $str;
    }
    $output .= "]";
}

$file = fopen($out, "w");
fwrite($file, $output);
fclose($file);

/*
var data = new google.visualization.DataTable();
data.addColumn('number', 'Time');
data.addColumn('number', 'Atrium');
data.addColumn('number', 'Ventricle');

data.addRows([
  [0, 0, 0],    [1, 10, 5],   [2, 23, 15],  [3, 17, 9],   [4, 18, 10],  [5, 9, 5],
  [6, 11, 3],   [7, 27, 19],  [8, 33, 25],  [9, 40, 32],  [10, 32, 24], [11, 35, 27],
  [12, 30, 22], [13, 40, 32], [14, 42, 34], [15, 47, 39], [16, 44, 36], [17, 48, 40],
  [18, 52, 44], [19, 54, 46], [20, 42, 34], [21, 55, 47], [22, 56, 48], [23, 57, 49],
  [24, 60, 52], [25, 50, 42], [26, 52, 44], [27, 51, 43], [28, 49, 41], [29, 53, 45],
  [30, 55, 47], [31, 60, 52], [32, 61, 53], [33, 59, 51], [34, 62, 54], [35, 65, 57],
  [36, 62, 54], [37, 58, 50], [38, 55, 47], [39, 61, 53], [40, 64, 56], [41, 65, 57],
  [42, 63, 55], [43, 66, 58], [44, 67, 59], [45, 69, 61], [46, 69, 61], [47, 70, 62],
  [48, 72, 64], [49, 68, 60], [50, 66, 58], [51, 65, 57], [52, 67, 59], [53, 70, 62],
  [54, 71, 63], [55, 72, 64], [56, 73, 65], [57, 75, 67], [58, 70, 62], [59, 68, 60],
  [60, 64, 56], [61, 60, 52], [62, 65, 57], [63, 67, 59], [64, 68, 60], [65, 69, 61],
  [66, 70, 62], [67, 72, 64], [68, 75, 67], [69, 80, 72]
]);

var options = {
  hAxis: {
    title: 'Time (s)'
  },
  vAxis: {
    title: 'Potential (mV)'
  }
};

var chart = new google.visualization.LineChart(document.getElementById('av_failure_chart'));
chart.draw(data, options);
*/

?>
