require 'open-uri'
require 'json'
require 'date'

module Jekyll
  class CourseTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
			if ENV["JEKYLL_ENV"] == "production"
				tmpl = File.read(File.join(Dir.pwd, "_includes", "box.html"))
				today = Date.today
				term = "Fall"
				if today.month >=  1 and today.month < 6
					term = "Spring"
				elsif today.month >= 6 and today.month < 8
					term = "Summer"
				end
				term = "#{term} #{today.year.to_s}"
				output = ""
				JSON.parse(URI.parse("https://andrew.pilsch.com/courses/courses.php?json&blank&front_page&term=#{URI.escape(term).to_s}").read).each do |course|
					course["image"] = course["course_image"]
					course["title"] = "#{course["course_number"]} #{course["course_title"]}, #{course["course_term"]}"
					course["id"] = course["course_id"]
					includes = {"include" => {"content" => course, "type" => "course" }}
					output += (Liquid::Template.parse tmpl).render includes
				end
			end
			output
    end
  end
end
Liquid::Template.register_tag('current_courses', Jekyll::CourseTag)
