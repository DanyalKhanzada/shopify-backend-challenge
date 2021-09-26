const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags & its associated Product data
  Tag.findAll({
    include: [
      {
        model: Product, as: "tagged_product",
        attributes: ['id','product_name'],
    }]
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    res.send(`<p>`+err+`</p>`);
    res.status(500).json(err);
  })
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id` & include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Product, as: "tagged_product",
        attributes: ['id','product_name'],
    }]
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    res.send(`<p>`+err+`</p>`);
    res.status(500).json(err);
  })
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then(dbTagData => res.json(dbTagData))
  .catch(err => {
    res.send(`<p>`+err+`</p>`);
    res.status(500).json(err);
  })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    res.send(`<p>`+err+`</p>`);
    res.status(500).json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    res.send(`<p>`+err+`</p>`);
    res.status(500).json(err);
  })
});

module.exports = router;
