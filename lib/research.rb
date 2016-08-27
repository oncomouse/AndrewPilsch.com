module ResearchManager
	class << self
		def registered(app)
			app.send :include, Helpers
		end
		alias :included :registered
	end
	
	module Helpers
		def articles
			data.research.articles.map do |id, data|
				
				next if data.nil?
				
				data[:type] = "article"
				
				if data[:journal_url]
					data[:journal] = link_to("<em>#{data[:journal]}</em>", data[:journal_url])
				else
					data[:journal] = "<em>#{data[:journal]}</em>"
				end
				
				# Set the Journal Information based on article status:
				if data[:published]
					if data[:issue_number]
						publication_information = ", #{data[:issue_number]} (#{data[:issue_date]})"
					else
						publication_informaiton = ""
					end
					data[:journal_information] = "Published  in #{data[:journal]}#{publication_information}"
				elsif !data[:published]
					if data[:status].downcase == "under review" or data[:status].downcase == "submitted"
						data[:journal_information] = "Under Review at #{data[:journal]}"
					elsif data[:status].downcase == "in progress"
						data[:journal_information] = "Target Journal: #{data[:journal]}"
					elsif data[:status].downcase == "revise & resubmit" or data[:status].downcase == "revise and resubmit"
						data[:journal_information] = "Revise and Resubmit from #{data[:journal]}"
					elsif data[:status].downcase == "forthcoming"
						data[:journal_information] = "Forthcoming in #{data[:journal]}"
					else
						data[:journal_information] = "Journal Error"
					end
				end
				
				data
			end
		end
		
		def books
			data.research.books.map do |id, data|
				
				next if data.nil?
				
				data[:type] = "book"
				
				data
			end
		end
        
		def other
			data.research.other.map do |id, data|
				next if data.nil?
				
				data[:type] = "other"
				
				data
			end
		end
		
		def presentations
			data.research.presentations.map do |id, data|
				
				next if data.nil?
				
				data[:type] = "presentation"
				
				data[:date] = Date.strptime(data[:date],"%m/%d/%Y")
				data[:delivered] = data[:date] < Date.today
				
				if data[:conference_url]
					data[:conference] = link_to(data[:conference], data[:conference_url])
				end
				
				data
			end
		end
		
		def research
			if not config.to_h.has_key? :research
				yaml_data = []
				# Parse Articles:
				yaml_data += articles
				# Parse Books:
				yaml_data += books
				# Parse Presentations:
				yaml_data += presentations
	            yaml_data += other
				yaml_data = yaml_data.map do |data|
					if data[:id] && (File.exists? "#{root}/#{config[:source]}/#{config[:images_dir]}/research/#{data[:id]}.png")
						data[:image] = image_path("research/#{data[:id]}.png")
					else
						data[:image] = "http://fakeimg.pl/960x500/?text=Image Not Found&font=lobster"
					end
					if !data[:short_title]
						data[:short_title] = data[:title]
					end
			
					if data['front_page'].nil?
						data['front_page'] = false
					end
					data
				end
				config[:research] = yaml_data
			end
			config[:research]
		end
	end
end
::Middleman::Extensions.register(:research_manager, ResearchManager)