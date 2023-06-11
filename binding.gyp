{
  "targets": [
    {
      "target_name": "whisper",
      "sources": [
        "./src/lib/whisper/binding.cpp",
        "./src/lib/whisper/whisper.cpp/ggml.c",
        "./src/lib/whisper/whisper.cpp/whisper.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "./src/lib/whisper/whisper.cpp"
      ],
      "conditions": [
        ['OS=="mac"', {
          "include_dirs": [ "/opt/homebrew/Cellar/libsndfile/1.2.0_1/include" ],
          "libraries": [ "-L/opt/homebrew/Cellar/libsndfile/1.2.0_1/lib", "-lsndfile" ]
        }],
        ['OS=="linux"', {
          "include_dirs": [ "/usr/local/include" ],
          "libraries": [ "-L/usr/local/lib", "-lsndfile"]
        }]
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "cflags_cc": [ "-std=c++11" ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
    }
  ]
}
