require 'flickraw'
class FlickrImage < Liquid::Tag

  def initialize(tag_name, markup, tokens)
     super
     @markup = markup
     @id   = markup.split(' ')[0]
     @size = markup.split(' ')[1]
  end

  def render(context)

    FlickRaw.api_key        = "eeb256a179183858d3ba36919cbc38e3"
    FlickRaw.shared_secret  = "738386c2bdc543f6"

    info = flickr.photos.getInfo(:photo_id => @id)

    server        = info['server']
    farm          = info['farm']
    id            = info['id']
    secret        = info['secret']
    title         = info['title']
    description   = info['description']
    size          = "_#{@size}" if @size
    src           = "http://farm#{farm}.static.flickr.com/#{server}/#{id}_#{secret}#{size}.jpg"
    page_url      = info['urls'][0]["_content"]

    img_tag       = "<img src='#{src}' title='#{title}'/>"
    link_tag      = "<a href='#{page_url}'>#{img_tag}</a>"

  end
end

Liquid::Template.register_tag('flickr_image', FlickrImage)
