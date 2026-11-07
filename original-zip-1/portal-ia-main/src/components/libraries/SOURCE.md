# Libraries.dev

Referência: https://libraries.dev/voice.
Repositório MIT: https://github.com/Jakubantalik/Libraries.dev.
Commit consultado: `1c87c11703be85d119af35d4c9298996f2ec0ec7`.
Licença preservada em LICENSE.

Os tokens, a geometria e os padrões de composição foram adaptados de `sites/home/public/assets/site.css` e `sites/home/voice.html` para os componentes existentes. Os ícones e a marca do site de referência não foram copiados. A fonte Saans também não foi copiada.

O pacote oficial `voice-glow@0.3.0` fornece VoiceBeam e useMicrophone em `features/home/VoiceSearch.tsx`. O efeito lê o stream local após a pessoa ativar o botão; fica pausado sem um stream ativo e respeita movimento reduzido. A troca para Instalar desmonta o componente e libera o microfone. Não há reconhecimento de fala, gravação, resposta de IA nem serviço de áudio remoto.

O estudo de especificação fica em `docs/LIBRARIES-DESIGN.md`. Recursos do Studio pagos não foram incluídos nem imitados como funcionalidades existentes.
