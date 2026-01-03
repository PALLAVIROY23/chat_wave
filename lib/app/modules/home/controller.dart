import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'chat_message.dart';

class HomeController extends GetxController {
  var messages = <ChatMessage>[].obs;
  final textController = TextEditingController();
  final isLoading = false.obs;



  Future<void> sendMessage() async {
    final text = textController.text.trim();
    if (text.isEmpty) return;

    messages.add(ChatMessage(text: text, isUser: true));
    textController.clear();
    isLoading.value = true;

    try {
      final response = await http.post(
        Uri.parse("http://10.0.2.2:5001/chatwave-54a96/us-central1/chatbot"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"message": text}),
      );


      if (response.statusCode != 200) {
        throw Exception("Server error");
      }

      final data = jsonDecode(response.body);

      messages.add(ChatMessage(text: data['reply'], isUser: false));
    } catch (e) {
      messages.add(
        ChatMessage(
          text: "AI is unavailable right now. Please try again.",
          isUser: false,
        ),
      );
    } finally {
      isLoading.value = false;
    }
  }
}
