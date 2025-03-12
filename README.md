# PRRI-CognitiveAgents2025

A visual novel game based on the B.A.R.I.C.A. kognitive agents platform developed by students in the [Artificial Intelligence Laboratory](https://ai.foi.hr/) at the [University of Zagreb Faculty of Organization and Informatics](https://www.foi.unizg.hr/). The game is developed using the [Twine](https://twinery.org/) interactive fiction engine. More details available at [itch.io](https://ailab-foi.itch.io/prri-cognitiveagents2025).

## Instructions

To start and test the game position your console to `src/` and start the server:

```
python3 server.py
```

Then navigate in your browser to `http://localhost:5000`

To train the agent use:

```
python3 server.py --train
```

To just test the current agent use:

```
python3 chat-test.py
```

To edit the game download [Twine](https://twinery.org/) and load the `The Deathworlders.twee` file. When happy with edits use `Publish to file` and publish it as `src/templates/index.html`.  
