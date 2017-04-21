class MarkdownFilter < Middleman::Extension
	def initialize(app, options_hash={}, &block)
		@@app = app
		super
	end
	
	helpers do
		def markdown(&block)
			raise ArgumentError, "Missing block" unless block_given?
			content = capture_html(&block)
			Tilt['markdown'].new(config[:markdown]) { content }.render(@@app) #concat
		end
		def markdownERB(&block)
			raise ArgumentError, "Missing block" unless block_given?
			content = capture_html(&block)
			concat Tilt['markdown'].new(config[:markdown]) { content }.render(@@app)
		end
	end
end
::Middleman::Extensions.register(:markdown_filter, MarkdownFilter)