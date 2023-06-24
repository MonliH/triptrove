from glob import glob
import json

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

places = {}
for file in glob("*.txt"):
    place = file.split(".")[0]
    places[place] = []
    with open(file, "r") as f:
        contents = f.read().split("\n")
        for c in chunks(contents, 3):
            if len(c) == 3:
                places[place].append([c[0], int(c[-1].split(" ")[0])])

for place in places:
    places[place] = sorted(places[place], key=lambda x: -x[-1])
    places[place] = list(map(lambda x: x[0], filter(lambda x: x[-1] > 35, places[place])))

json.dump(places, open("places.json", "w"))
