# Scene art folders

Every scene has a folder here, e.g. **`blaze-pit-lane/`**.

## Preferred path
Use the numbered packs in [`../gen/INDEX.md`](../gen/INDEX.md):

```
public/gen/38_blaze-pit-lane__0/DROP/image.png
public/gen/39_blaze-pit-lane__1/DROP/image.png
…
```

## Legacy flat drop (still works)
Or put files straight in the scene folder:

```
public/art/blaze-pit-lane/0.png
public/art/blaze-pit-lane/1.png
public/art/blaze-pit-lane/2.png
public/art/blaze-pit-lane/3.png
```

Each scene folder now includes:
- `README.txt` — peels + both drop paths
- `N_POSITIVE.txt` — prompt per layer
- `NEGATIVE.txt` / `SETTINGS.txt`

Game loads **gen DROP first**, then falls back to `art/<scene>/N.png`.

Style: thick bold outlines, flat Mosbles cel, slightly detailed face/hair.
