const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && ['news', 'rule', 'faq'].includes(category)) {
      query.category = category;
    }
    const posts = await Post.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .populate('author', 'fullName email avatarUrl');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách bài đăng', error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Vui lòng nhập tiêu đề và nội dung bài đăng' });
    }

    const post = await Post.create({
      title,
      content,
      category: category || 'news',
      isPinned: isPinned || false,
      author: req.user._id
    });

    await post.populate('author', 'fullName email avatarUrl');
    res.status(201).json({ message: 'Tạo bài đăng thành công', post });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo bài đăng', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, isPinned } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category && ['news', 'rule', 'faq'].includes(category)) post.category = category;
    if (isPinned !== undefined) post.isPinned = isPinned;

    await post.save();
    res.json({ message: 'Cập nhật bài đăng thành công', post });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật bài đăng', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng để xóa' });
    }
    res.json({ message: 'Xóa bài đăng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa bài đăng', error: error.message });
  }
};
