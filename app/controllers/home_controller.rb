%w(rubygems wordnik).each {|lib| require lib}
require "randexp"
require 'logger'

class HomeController < ApplicationController

  def index
  	full_name
  end

  def ajax_name
  	full_name
  	render :partial => "home/name"
  end

  def full_name
    @endsWithS = false
    begin
    	@name = get_name
      if @name[-1, 1] == "S"
        @endsWithS = true
        @name = @name.chomp("S")
      end
    rescue
      logger.info "exception thrown getting word from wordnik"
      @name = "iUmmmm"
    end
  end

  def get_name
    name = ""
    begin
      name = name_wordnik
    rescue
      begin
        name = name_randexp
      rescue
        name = "Ummmm"
      end
    end
    return "i" + name + " " + rand_type + " " + rand_generation
  end

  def name_wordnik
    return Wordnik.words.get_random_word(:hasDictionaryDef => 'true', :includePartOfSpeech => 'noun')["word"].capitalize
  end

  def name_randexp
    return /[:word:]/.gen.capitalize
  end

  def rand_type
  	if rand(100) <= 5 then
	  return "U2 Special Edition"
	end
  	return ["", "mini", "nano", "touch", "shuffle"].sample
  end

  def rand_generation
  	#return ["2", "2G", "2 <span>S</span>", "2G<span>S</span>", "3", "3G", "3<span>S</span>", "3G<span>S</span>", "4", "4G", "4<span>S</span>", "4G<span>S</span>", "classic"].sample
    return ["2", "2G", "2S", "2GS", "3", "3G", "3S", "3GS", "4", "4G", "4S", "4GS", "classic"].sample
  end

end
