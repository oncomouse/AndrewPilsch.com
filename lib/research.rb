require 'yaml'

module ResearchManager
	class << self
		def registered(app)
			app.send :include, Helpers
			app.set :research_dir, 'source/research'
			app.set :research_image_dir, 'source/research/images'
			#app.set :data_dir, 'source/courses/data'
		end
		alias :included :registered
	end
	
	module Helpers
		YAML_ERRORS = [ Exception, ArgumentError ]

		if defined?(Psych) && defined?(Psych::SyntaxError)
			YAML_ERRORS << Psych::SyntaxError
		end
		
		def read_yaml_data(yaml_file)
			begin
				data = YAML.load(IO.read(yaml_file))
			rescue *YAML_ERRORS => e
				logger.error "YAML Exception: #{e.message}"
				return nil
			end
			if data["id"] && (File.exists? "#{Dir.pwd}/#{research_image_dir}/#{data["id"]}.png")
				data["image"] = "/#{research_image_dir}/#{data["id"]}.png".gsub(/^.*source\//,"")
			else
				data["image"] = "http://fakeimg.pl/960x500/?text=Image Not Found&font=lobster"
			end
			
			if !data["short_title"]
				data["short_title"] = data["title"]
			end
			
			if data['front_page'].nil?
				data['front_page'] = false
			end
			
			return data
		end
		
		def articles
			yaml_data = []
			Dir.glob("#{Dir.pwd}/#{research_dir}/articles/*.yml") do |file_name|
				
				data = read_yaml_data(file_name)
				
				next if data.nil?
				
				data["type"] = "article"
				
				if data["journal_url"]
					data["journal"] = link_to("<em>#{data["journal"]}</em>", data["journal_url"])
				else
					data["journal"] = "<em>#{data["journal"]}</em>"
				end
				
				# Set the Journal Information based on article status:
				if data["published"]
					if data["issue_number"]
						publication_information = ", #{data["issue_number"]} (#{data["issue_date"]})"
					else
						publication_informaiton = ""
					end
					data["journal_information"] = "Published  in #{data["journal"]}#{publication_information}"
				elsif !data["published"]
					if data["status"].downcase == "under review" or data["status"].downcase == "submitted"
						data["journal_information"] = "Under Review at #{data["journal"]}"
					elsif data["status"].downcase == "in progress"
						data["journal_information"] = "Target Journal: #{data["journal"]}"
					elsif data["status"].downcase == "revise & resubmit" or data["status"].downcase == "revise and resubmit"
						data["journal_information"] = "Revise and Resubmit from #{data["journal"]}"
					elsif data["status"].downcase == "forthcoming"
						data["journal_information"] = "Forthcoming in #{data["journal"]}"
					else
						data["journal_information"] = "Journal Error"
					end
				end
				
				yaml_data << data
			end
			return yaml_data
		end
		
		def books
			yaml_data = []
			Dir.glob("#{Dir.pwd}/#{research_dir}/books/*.yml") do |file_name|

				data = read_yaml_data(file_name)
				
				next if data.nil?
				
				data["type"] = "book"
				
				yaml_data << data
			end
			return yaml_data
		end
		
		def presentations
			yaml_data = []
			Dir.glob("#{Dir.pwd}/#{research_dir}/presentations/*.yml") do |file_name|
				
				data = read_yaml_data(file_name)
				
				next if data.nil?
				
				data["type"] = "presentation"
				
				data["date"] = Date.strptime(data["date"],"%m/%d/%Y")
				data["delivered"] = data["date"] < Date.today
				
				if data["conference_url"]
					data["conference"] = link_to(data["conference"], data["conference_url"])
				end
				
				yaml_data << data
			end
			return yaml_data
		end
		
		def research
			yaml_data = []
			#Dir.glob("#{Dir.pwd}/#{data_dir}/*.yml").each do |yaml_file|
			# Parse Articles:
			yaml_data += articles
			# Parse Books:
			yaml_data += books
			# Parse Presentations:
			yaml_data += presentations
			return yaml_data
		end
	end
end
::Middleman::Extensions.register(:research_manager, ResearchManager)