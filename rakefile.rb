require "uglifier"

source_files = [
  "src/license.txt",
  "src/pre.txt",
  "src/Core.js",
  "src/Page.js",
  "src/Send.js",
  "src/pages/Form.js",
  "src/pages/Review.js",
  "src/pages/Screenshot.js",
  "src/send/xhr.js",
  "src/post.txt",
]

def get_the_file(filename)
  # Create or blank the compiled file
  if File.exists?(filename)
    File.open(filename, 'w') {|file| file.truncate(0) }
  else
    File.new(filename, "w")
  end
  
  File.open(filename, "w")
end

def concatenate(file_array)
  concat = ""
  file_array.each do |file|
    src = File.open(file, "r")
    concat << src.read << "\n"
    src.close
  end
  return concat
end

task :compile_unminified do
  feedback = get_the_file "feedback.js"
  feedback.puts concatenate source_files
end

# Runs fedback.js through Uglifyjs
task :compile_minified do
  min_feedback = get_the_file "feedback.min.js"
  min_feedback.puts Uglifier.compile(concatenate source_files)
end

task :compile_all => [:compile_unminified, :compile_minified] do
  puts "Done!"
end