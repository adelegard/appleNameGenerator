%w(rubygems wordnik).each {|lib| require lib}
require "randexp"

class ResponseWord < ActiveRecord::Base
    class << self
        def get_name
            name = ""
            begin
                if rand(100) <= 5
                    name = name_wordnik
                else
                    name = name_db
                end
            rescue
                logger.error "exception thrown getting word from wordnik"
                begin
                    name = name_randexp
                rescue Exception => ex
                    logger.error "An error of type #{ex.class} happened, message is #{ex.message}"
                    logger.error "exception thrown getting word from randexp"
                    name = "Ummmm"
                end
            end
            return "i" + name + " " + rand_type + " " + rand_generation
        end

        private

        def get_synonym_of(synonym)
            if synonym != nil && synonym.to_s != ""
                if rand(100) <= 5
                    name = synonym_wordnik(synonym)
                    name = name + " RAND FETCH synonym wordnik "
                else
                    name = synonym_db(synonym)
                    if name == nil || name == ""
                        name = synonym_wordnik(synonym)
                        name = name + " NOT IN DB FETCH synonym wordnik "
                    else
                        name = name + " IN DB synonym "
                    end
                end
            end
        end

        def name_db
            return ResponseWord.first(:offset => rand(ResponseWord.count)).response.capitalize
        end

        def name_wordnik
            name = Wordnik.words.get_random_word(:hasDictionaryDef => 'true', :includePartOfSpeech => 'noun')["word"].capitalize
            ResponseWord.create(:response => name)
            return name
        end

        def synonym_db(word)
            response_words = ResponseWord.where(:synonym => word)
            if response_words == nil || response_words.empty? || response_words.length < response_words[0].synonym_count
                name = synonym_wordnik(word)
                return name
            end
            return response_words.sample.response.capitalize
        end

        def synonym_wordnik(word)
            return_name = nil
            words = Wordnik.word.get_related(word, :type => 'synonym')
            if words.empty?
                return_name = name_db
            else
                words_array = words[0]["words"]
                return_name = words_array.sample.capitalize
                ResponseWord.create(:response => return_name, :synonym => word, :synonym_count => words_array.length)
            end
            return return_name
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
            return ["2", "2G", "2S", "2GS", "3", "3G", "3S", "3GS", "4", "4G", "4S", "4GS", "classic"].sample
        end
    end

end
