from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

itemlist: list[Item] = []


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return itemlist[item_id]

@app.get("/items")
def read_items():
    return {i: item for i, item in enumerate(itemlist)}


@app.put("/items")
def update_item(item: Item):
    itemlist.append(item)
    return item