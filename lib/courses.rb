require 'yaml'

module CourseManager
	class << self
		def registered(app)
			app.send :include, Helpers
			app.set :course_dir, 'source/courses'
			app.set :course_image_dir, 'source/courses/images'
			app.set :course_data_dir, 'source/courses/data'
		end
		alias :included :registered
	end
	
	module Helpers
		YAML_ERRORS = [ Exception, ArgumentError ]

		if defined?(Psych) && defined?(Psych::SyntaxError)
			YAML_ERRORS << Psych::SyntaxError
		end
		def courses
			course_yaml_data = []
			#Dir.glob("#{Dir.pwd}/#{course_data_dir}/*.yml").each do |yaml_file|
			Dir.foreach("#{Dir.pwd}/#{course_dir}") do |file_name|	
				yaml_file = nil
				if file_name =~ /.*\.yml$/
					yaml_file = "#{Dir.pwd}/#{course_dir}/#{file_name}"
				elsif File.directory? "#{Dir.pwd}/#{course_dir}/#{file_name}"
					if Dir.glob("#{Dir.pwd}/#{course_dir}/#{file_name}/*.yml").length > 0
						yaml_file = Dir.glob("#{Dir.pwd}/#{course_dir}/#{file_name}/*.yml")[0]
					end
				end
				
				next if yaml_file.nil?
				
				begin
					data = YAML.load(IO.read(yaml_file))
				rescue *YAML_ERRORS => e
					logger.error "YAML Exception: #{e.message}"
					return false
				end
				if data["course_term"]
					data["course_term"] = CourseDate.new(data["course_term"])
				end
				if data["course_id"] && File.directory?("#{Dir.pwd}/#{course_dir}/#{data["course_id"]}") && Dir.glob("#{Dir.pwd}/#{course_dir}/#{data["course_id"]}/*.png").length > 0
					data["course_image"] = "#{course_dir}/#{data["course_id"]}/#{File.basename(Dir.glob("#{Dir.pwd}/#{course_dir}/#{data["course_id"]}/*.png")[0])}".gsub(/^.*source\//,"")
				elsif data["course_id"] && (File.exists? "#{Dir.pwd}/#{course_image_dir}/#{data["course_id"]}.png")
					data["course_image"] = "#{course_image_dir}/#{data["course_id"]}.png".gsub(/^.*source\//,"")
				else
					data["course_image"] = "http://fakeimg.pl/960x500/?text=Image Not Found&font=lobster"
				end
				if !data["course_url"]
					data["course_url"] = link_to("","/#{course_dir.gsub("source/","")}/#{data["course_id"]}/").gsub("<a href=\"","").gsub('"></a>','')
				end
				course_yaml_data << data
			end
			course_yaml_data
		end
	end
end
::Middleman::Extensions.register(:course_manager, CourseManager)

class CourseDate
	# This is set up for terms, but you can easily change it to quarters by adding a fourth term:
	@@term_month_translation = {
		"Spring" => 1,
		"Summer" => 6,
		"Fall" => 8,
	}
	@@course_term_names = "((?:#{@@term_month_translation.keys.join("|")}))"
	@@course_date_regexp = Regexp.new("#{@@course_term_names}\s+([0-9]{2,4})")
	@@course_term_names_regexp = Regexp.new(@@course_term_names)
	
	
	def initialize(starter_value)
		if starter_value.class == String && starter_value =~ @@course_date_regexp
			@term = $1
			@year = $2
		else
			if starter_value.class == String && starter_value =~ @@course_term_names_regexp
				@year = Date.today.year
				@term = $1
			else
				@year = Date.today.year
				@term = CourseDate.to_term(Date.today.month)
			end
		end
		@date = CourseDate.to_date(@term, @year)
	end
	
	def date
		@date
	end
	
	def to_s
		"#{@term} #{@year}"
	end
	
	def self.to_date(term, year)
		date = nil
		if @@term_month_translation[term]
			date = Date.new(year.to_i, @@term_month_translation[term], 1)
		end
		date
	end
	
	# Given a month, guess the term:
	def self.to_term(month)
		month = month.to_i
		term = ""
		@@term_month_translation.each do |t, m|
			if month >= m
				term = t
			else
				break
			end
		end
		term
	end
end