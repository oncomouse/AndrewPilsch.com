module Haml::Filters
    # This is important (it fixes inline Markdown rendering)
    remove_filter("Markdown")
    module Markdown
        include Base
        def render text
            md_options = {
                :fenced_code_blocks => true,
                :autolink => true, 
                :smartypants => true,
                :footnotes => true,
                :superscript => true,
                "entity_output" => :symbolic 
            }

            ::Tilt.prefer ::Middleman::Renderers::KramdownTemplate
            template = ::Tilt['markdown'].new(md_options){ text }.render(config)
        end
    end
end