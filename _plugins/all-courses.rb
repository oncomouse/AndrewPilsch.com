require 'open-uri'
require 'json'
require 'date'

$courses = []
$terms = []
if ENV["JEKYLL_ENV"] == "production"
	JSON.parse(URI.parse("https://andrew.pilsch.com/courses/courses.php?json").read).each do |course|
		course["image"] = course["course_image"]
		course["title"] = "#{course["course_number"]} #{course["course_title"]}, #{course["course_term"]}"
		course["id"] = course["course_id"]
		$courses.push course
		if not $terms.include?(course["course_term"])
			$terms.push(course["course_term"])
		end
	end
end
Jekyll::Hooks.register :site, :post_read do |site|
	site.data["courses"] = $courses
	site.data["terms"] = $terms
end
module Jekyll
  class AllCourseTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
			tmpl = File.read(File.join(Dir.pwd, "_includes", "box.html"))
			output = ""
			$courses.each do |course|
				includes = {"include" => {"content" => course, "type" => "course", "big" => true }}
				output += (Liquid::Template.parse tmpl).render includes
			end
			output
    end
  end
end
Liquid::Template.register_tag('all_courses', Jekyll::AllCourseTag)

