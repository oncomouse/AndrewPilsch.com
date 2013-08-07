<?php
	$search_string = "<!-- #yield -->";
	ob_start();
?>

		<header>
			<div class='container'>
				<div class='column no_space_after'>
					<h1>
						<a href="/">Dr. Andrew Pilsch</a>
					</h1>
					<h2>Courses</h2>
				</div>
			</div>
		</header>
		<section id='courses'>
			<div class='container'>
<?php
	require_once "spyc.php";

	function create_date_from_term($term) {
		return strtotime(
			str_replace(
				array("Fall","Spring","Summer"),
				array("August 01", "March 01", "June 01"),
				$term
			)
		);
	}
	
	function compare_course_dates($a,$b) {
		return strcmp($b["course_date"], $a["course_date"]);
	}

	date_default_timezone_set('America/New_York');
	$directory_listing = scandir('.');
	$courses = array();
	foreach ($directory_listing as $file) {
		if (substr($file,0,1) == ".") {
			continue;
		}
		
		$yaml = false;
		if (is_dir($file) && file_exists("$file/$file.yml")) {
			$yaml = spyc_load_file("$file/$file.yml");
		} else if(substr($file,strrpos($file, ".")+1) == "yml" or substr($file,strrpos($file, ".")+1) == "yaml") {
			$yaml = spyc_load_file("$file");
		}
		if (!$yaml) {
			continue;
		}		
		
		if(!array_key_exists("course_url", $yaml)) {
			$yaml["course_url"] = "/courses/{$yaml["course_id"]}";
		}
		
		if(file_exists("images/{$yaml["course_id"]}.png")) {
			$yaml["course_image"] = "/courses/images/{$yaml["course_id"]}.png";
		} else {
			$yaml["course_image"] = "http://fakeimg.pl/960x500/?text=Image Not Found&font=lobster";
		}
		$yaml["course_date"] = create_date_from_term($yaml["course_term"]);
		$courses[] = $yaml;
	}
	
	usort($courses, "compare_course_dates");
	
	$current_term = "";
	$current_course = 0;
	foreach ($courses as $course) {
		if($course["course_term"] != $current_term) {
?>
			<div class="column first whole no_space_after"><h2><?php echo $course["course_term"] ?></h2></div>
<?php
			$current_term = $course["course_term"];
			$current_course = 0;
		} ?>
			<div class="column link<?php echo ($current_course % 2 == 1) ? " omega" : ""; ?>">
				<a href="<?php echo $course["course_url"]; ?>">
					<h3>
						<span class="course_number"><?php echo $course["course_number"]; ?>:</span>
						<span class="course_title"><?php echo $course["course_title"]; ?></span>
					</h3>
					<img src="<?php echo $course["course_image"]; ?>" />
					<p class="course_description"><?php echo preg_replace(array('/^\\"/','/\\"$/'),"",join(" ",$course["course_description"])); ?></p>
				</a>
			</div>
				<?php $current_course += 1; ?>
<?php
	}
?>
			</div>
		</section>
<?php
	$course_display_content = ob_get_clean();
	
	$file_template = "<html><head></head><body>$search_string</body></html>";
	if (file_exists("blank.html")) {
		$file_template = file_get_contents("blank.html");
	}
	
	print str_replace($search_string, $course_display_content, $file_template);
?>